# Contributing to Aarogyam (आरोग्यम्)

Thank you for your interest in contributing to the Aarogyam organ allocation system! This project aims to save lives through fair, AI-driven organ allocation across India.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- **Git** for version control
- **MongoDB** (local or Atlas connection)
- A modern code editor (VS Code recommended)

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/project_aarogyam.git
cd project_aarogyam

# 2. Install all dependencies
npm run install-all

# 3. Configure environment variables
cp server/.env.example server/.env
# Edit server/.env with your local configuration

# 4. Start development servers
npm run dev
```

The client runs on `http://localhost:3000` and the server on `http://localhost:5000`.

---

## 📋 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, structured history.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                                      |
|:-----------|:-------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documentation changes only                       |
| `style`    | Code style (formatting, semicolons, etc.)        |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                          |
| `test`     | Adding or updating tests                         |
| `chore`    | Build process, tooling, or dependencies          |

### Examples

```bash
feat(allocation): add bias detection to scoring algorithm
fix(auth): resolve JWT expiry not refreshing on activity
docs(readme): update API endpoint documentation
style(hospital-portal): fix inconsistent button padding
refactor(services): extract notification templates to constants
test(allocation): add unit tests for gender parity scoring
```

---

## 🌿 Branch Naming

```
feature/<short-description>    # New features
fix/<short-description>        # Bug fixes
docs/<short-description>       # Documentation updates
refactor/<short-description>   # Code refactoring
```

**Examples:**
- `feature/dark-theme-toggle`
- `fix/rfid-reader-timeout`
- `docs/api-reference-update`

---

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, atomic commits
3. **Test your changes** locally (both client and server)
4. **Update documentation** if your changes affect APIs or user-facing features
5. **Open a Pull Request** with:
   - A clear title following the commit convention
   - Description of what changed and why
   - Screenshots for UI changes
   - Link to any related issues

### PR Checklist

- [ ] Code follows existing style patterns
- [ ] Self-review of the code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No new warnings or errors in console
- [ ] Tests pass locally

---

## 📁 Project Structure

```
project_aarogyam/
├── client/src/
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers (e.g., ThemeContext)
│   ├── pages/         # Page-level route components
│   └── index.css      # Global styles with CSS custom properties
│
├── server/
│   ├── config/        # Database configuration
│   ├── middleware/     # Express middleware (auth, validation)
│   ├── models/        # Mongoose data models
│   ├── routes/        # API route handlers
│   └── services/      # Business logic services
```

---

## 🎨 Code Style Guidelines

### Frontend (React)
- Use functional components with hooks
- Use Material-UI (MUI) for UI components
- Use `useThemeMode()` hook for dark/light theme awareness
- Use Framer Motion for animations
- Keep components focused and reusable

### Backend (Node.js/Express)
- Use `async/await` for asynchronous operations
- Return consistent JSON response format: `{ success: true/false, data/error }`
- Log actions via `auditService` for compliance
- Include demo/fallback data for routes when DB is unavailable

### CSS
- Use CSS custom properties defined in `index.css` for theme-aware colors
- Prefer `var(--property-name)` over hardcoded color values
- Add `[data-theme="dark"]` overrides for dark mode specifics

---

## 🐛 Reporting Issues

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Screenshots or error logs if applicable

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping build a fairer healthcare system in India! 🏥❤️**
