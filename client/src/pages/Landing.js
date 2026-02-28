import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = '/browse';
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        
        <div className="absolute inset-0 bg-cover bg-center opacity-50" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920')"
             }}
        />

        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-white text-lg mb-8">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/pricing"
                className="px-8 py-4 bg-red-600 text-white text-xl font-semibold rounded hover:bg-red-700 transition text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-gray-800 text-white text-xl font-semibold rounded hover:bg-gray-700 transition text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 border-t-8 border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">📺</div>
              <h3 className="text-white text-xl font-bold mb-2">Watch on any device</h3>
              <p className="text-gray-400">
                Stream on your phone, tablet, laptop, and TV without extra charges.
              </p>
            </div>

            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">📥</div>
              <h3 className="text-white text-xl font-bold mb-2">Download and watch offline</h3>
              <p className="text-gray-400">
                Save your favorites easily and always have something to watch.
              </p>
            </div>

            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-bold mb-2">Create profiles for kids</h3>
              <p className="text-gray-400">
                Send kids on adventures with their favorite characters in a space made just for them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t-8 border-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-white text-4xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-gray-900 p-6 rounded">
              <summary className="text-white text-xl font-semibold cursor-pointer">
                What is StreamFlix?
              </summary>
              <p className="text-gray-400 mt-4 text-left">
                StreamFlix is a streaming service that offers a wide variety of award-winning TV shows, movies, documentaries, and more on thousands of internet-connected devices.
              </p>
            </details>

            <details className="bg-gray-900 p-6 rounded">
              <summary className="text-white text-xl font-semibold cursor-pointer">
                How much does StreamFlix cost?
              </summary>
              <p className="text-gray-400 mt-4 text-left">
                Watch StreamFlix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month.
              </p>
            </details>

            <details className="bg-gray-900 p-6 rounded">
              <summary className="text-white text-xl font-semibold cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="text-gray-400 mt-4 text-left">
                Yes! No long-term contracts or cancellation fees. You can easily cancel your account online with just a few clicks.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
