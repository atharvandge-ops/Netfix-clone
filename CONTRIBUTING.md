# Contributing Guide

Thank you for your interest in contributing to the Netflix Clone project!

## Development Workflow

### 1. Set Up Development Environment

Follow the `QUICKSTART.md` guide to set up your local environment.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update tests if applicable

### 4. Test Your Changes

**Backend:**
```bash
cd server
npm test
```

**Frontend:**
```bash
cd client
npm test
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "Description of your changes"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

### File Naming

- Components: PascalCase (e.g., `VideoCard.js`)
- Utilities: camelCase (e.g., `errorHandler.js`)
- Pages: PascalCase (e.g., `Landing.js`)

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable

## Adding New Features

### Backend API Endpoint

1. Create/update model in `server/models/`
2. Create controller in `server/controllers/`
3. Create route in `server/routes/`
4. Add route to `server/server.js`
5. Add tests in `server/__tests__/`

### Frontend Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.js`
3. Create service function in `client/src/services/`
4. Add Redux slice if needed
5. Add tests in `client/src/__tests__/`

## Testing

- Write tests for all new features
- Maintain minimum 70% code coverage
- Test edge cases and error scenarios

## Documentation

- Update README.md if adding major features
- Document new API endpoints in API.md
- Add JSDoc comments for complex functions

## Security

- Never commit `.env` files
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries
- Implement rate limiting for public endpoints

## Performance

- Optimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Lazy load components
- Optimize images and videos

## Questions?

Open an issue for any questions or concerns.
