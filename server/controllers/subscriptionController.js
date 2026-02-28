const stripe = require('../config/stripe');
const User = require('../models/User');
const Plan = require('../models/Plan');

const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE');

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ active: true }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
      error: error.message
    });
  }
};

const createSubscription = async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user.id;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID is required'
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.active) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive'
      });
    }

    const user = await User.findById(userId);

    if (DEMO_MODE) {
      console.log('🎭 DEMO MODE: Activating subscription without Stripe');
      
      user.subscriptionStatus = 'active';
      user.subscriptionPlan = plan._id;
      user.stripeCustomerId = `demo_cus_${userId}`;
      user.stripeSubscriptionId = `demo_sub_${Date.now()}`;
      user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Subscription activated successfully (Demo Mode)',
        data: {
          subscription: {
            id: user.stripeSubscriptionId,
            status: 'active',
            currentPeriodEnd: Math.floor(user.subscriptionExpiry.getTime() / 1000),
            demoMode: true
          }
        }
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan.stripePriceId }],
      expand: ['latest_invoice.payment_intent']
    });

    user.subscriptionStatus = 'active';
    user.subscriptionPlan = plan._id;
    user.stripeSubscriptionId = subscription.id;
    user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
        }
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    if (DEMO_MODE || user.stripeSubscriptionId.startsWith('demo_')) {
      console.log('🎭 DEMO MODE: Cancelling subscription');
      
      user.subscriptionStatus = 'cancelled';
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Subscription cancelled (Demo Mode)',
        data: {
          cancelAt: user.subscriptionExpiry
        }
      });
    }

    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    user.subscriptionStatus = 'cancelled';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription will be cancelled at period end',
      data: {
        cancelAt: subscription.cancel_at
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('subscriptionPlan');

    res.status(200).json({
      success: true,
      data: {
        subscriptionStatus: user.subscriptionStatus,
        plan: user.subscriptionPlan,
        expiry: user.subscriptionExpiry,
        hasActiveSubscription: user.hasActiveSubscription(),
        demoMode: DEMO_MODE
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status',
      error: error.message
    });
  }
};

const handleWebhook = async (req, res) => {
  if (DEMO_MODE) {
    return res.status(200).json({ received: true, demoMode: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: subscription.id });
        
        if (user) {
          user.subscriptionStatus = subscription.status === 'active' ? 'active' : 'inactive';
          user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
          await user.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: subscription.id });
        
        if (user) {
          user.subscriptionStatus = 'expired';
          user.subscriptionExpiry = new Date();
          await user.save();
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const user = await User.findOne({ stripeCustomerId: invoice.customer });
        
        if (user) {
          user.subscriptionStatus = 'inactive';
          await user.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
};

module.exports = {
  getPlans,
  createSubscription,
  cancelSubscription,
  getSubscriptionStatus,
  handleWebhook
};
