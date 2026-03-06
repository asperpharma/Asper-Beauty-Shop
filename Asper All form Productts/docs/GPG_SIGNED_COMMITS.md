# GPG-signed commits (when the repo requires signed commits)

If your repository or organization requires signed commits, use the steps below.

---

## 1. Git identity

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the email associated with your GitHub account (or your org’s required
address).

---

## 2. GPG key

**Check that GPG is installed and list secret keys:**

```bash
gpg --list-secret-keys --keyid-format=long
```

If you don’t have a key, create one:
[GitHub – Generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

---

## 3. Tell Git which key to use

Replace `KEY_ID` with the key ID from step 2 (e.g. the 16-char hex after `sec`):

```bash
git config --global user.signingkey KEY_ID
```

---

## 4. GPG agent

Ensure your Git client can use the GPG agent:

- **macOS:** Often works with `gpg` from Homebrew; add to shell profile if
  needed: `export GPG_TTY=$(tty)`.
- **Linux:** Use your distro’s GPG agent (e.g. `gpgconf --launch gpg-agent`).
- **Windows:** Use Gpg4win or Windows GPG agent and ensure Git for Windows /
  your IDE can access it.

See your OS and Git client docs for details.

---

## 5. Create a signed commit

**Sign the next commit:**

```bash
git add <files>
git commit -S -m "Your commit message"
```

**Sign all commits by default:**

```bash
git config --global commit.gpgsign true
```

---

## 6. GitHub CLI / VS Code

- **GitHub CLI:** Ensure it uses the same Git and GPG setup; it will use your
  `commit.gpgsign` and `user.signingkey`.
- **VS Code / Cursor:** Use the integrated Git with the same global config; if
  signing fails, run `git commit -S` from a terminal where the GPG agent is
  available.

---

## Quick reference

| Step            | Command                                            |
| --------------- | -------------------------------------------------- |
| Set name        | `git config --global user.name "Your Name"`        |
| Set email       | `git config --global user.email "you@example.com"` |
| List GPG keys   | `gpg --list-secret-keys --keyid-format=long`       |
| Set signing key | `git config --global user.signingkey KEY_ID`       |
| Signed commit   | `git commit -S -m "message"`                       |
| Always sign     | `git config --global commit.gpgsign true`          |
