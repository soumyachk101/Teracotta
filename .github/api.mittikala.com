# 🤝 Contributing to Mitti Kala — Teracotta

First off, thank you for taking the time to contribute! 🎉
Every contribution, big or small, helps support the artisans of Bishnupur. 🏺

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Message Guide](#commit-message-guide)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)

---

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

---

## 🛠️ How to Contribute

You can contribute in many ways:

- 🐛 Report bugs via [Issues](https://github.com/soumyachk101/Teracotta/issues)
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix bugs or implement features
- 🌐 Help with translations

---

## 🚀 Getting Started

```bash
# 1. Fork the repository
# Click the "Fork" button on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/Teracotta.git
cd Teracotta

# 3. Add upstream remote
git remote add upstream https://github.com/soumyachk101/Teracotta.git

# 4. Create a new branch
git checkout -b feature/your-feature-name

# 5. Make your changes, then push
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub 🎉
```

---

## 🌿 Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/` | `feature/wishlist-page` |
| Bug Fix | `fix/` | `fix/cart-total-bug` |
| Docs | `docs/` | `docs/api-readme` |
| Refactor | `refactor/` | `refactor/auth-service` |
| Hotfix | `hotfix/` | `hotfix/payment-crash` |

---

## ✍️ Commit Message Guide

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add wishlist feature
fix: resolve cart total calculation bug
docs: update API documentation
refactor: simplify auth middleware
chore: update dependencies
```

---

## 🔃 Pull Request Process

1. Make sure your branch is up to date with `main`
2. Write a clear PR title and description
3. Link any related issues using `Closes #issue-number`
4. Wait for review — we'll respond within 2-3 days
5. Address feedback and get it merged! 🚀

---

## 🐛 Reporting Bugs

Open an [Issue](https://github.com/soumyachk101/Teracotta/issues) and include:

- **What happened?**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment** (OS, browser, Node version)

---

## 💬 Questions?

Reach out at **soumya.chk101@gmail.com** or open a Discussion on GitHub.

---

<div align="center">

*Built with ❤️ for the artisans of Bishnupur.*

</div>
