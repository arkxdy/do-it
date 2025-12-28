# Contributing to Do-it

First off, thank you for considering contributing to Do-it! It's people like you that make Do-it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details**:
  - Device type (iPhone, Android, iOS version, etc.)
  - Expo version
  - React Native version
  - Node version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript styleguide
* Include appropriate test cases
* End all files with a newline
* Avoid platform-dependent code
* Document new code based on the Documentation Styleguide

## Development Setup

### Requirements
- Node.js v16+
- npm or yarn
- Expo CLI

### Getting Started

1. **Fork the repository**
```bash
git clone https://github.com/your-username/do-it.git
cd do-it
```

2. **Create a branch for your changes**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

3. **Install dependencies**
```bash
npm install
```

4. **Make your changes**
- Write clean, readable code
- Follow existing code style
- Add TypeScript types where applicable

5. **Test your changes**
```bash
expo start
# Test on iOS, Android, or web
```

6. **Commit your changes**
```bash
git commit -m "feat: add your feature description"
# or
git commit -m "fix: describe the bug fix"
```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

* **feat:** A new feature
* **fix:** A bug fix
* **docs:** Documentation only changes
* **style:** Changes that do not affect the meaning of the code (formatting, etc.)
* **refactor:** A code change that neither fixes a bug nor adds a feature
* **perf:** A code change that improves performance
* **test:** Adding missing tests or correcting existing tests
* **chore:** Changes to build process, dependencies, etc.

Examples:
```bash
git commit -m "feat: add dark mode support"
git commit -m "fix: correct daily task reset logic"
git commit -m "docs: update README installation instructions"
git commit -m "refactor: simplify task filtering logic"
```

## Styleguides

### TypeScript Styleguide

* Use meaningful variable and function names
* Use interfaces for type definitions
* Add comments for complex logic
* Keep functions small and focused

```typescript
// Good
interface TaskFilter {
  type: 'daily' | 'global';
  completed: boolean;
}

const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter(task => 
    task.type === filter.type && task.completed === filter.completed
  );
};

// Avoid
const filter = (t: any[], f: any): any[] => {
  return t.filter(x => x.t === f.t && x.c === f.c);
};
```

### React Component Styleguide

* Use functional components with hooks
* Keep components focused and reusable
* Use TypeScript for props

```typescript
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete 
}) => {
  return (
    // Component JSX
  );
};
```

### Naming Conventions

* **Variables/Functions**: camelCase
* **Components**: PascalCase
* **Constants**: UPPER_SNAKE_CASE
* **Interfaces**: PascalCase with leading `I` (optional)

### File Structure

```
src/
├── components/
│   ├── TaskItem.tsx
│   ├── HistoryItem.tsx
│   └── StatsCard.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useHistory.ts
├── types/
│   └── index.ts
└── App.tsx
```

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Test on both iOS and Android simulators/devices
* Test keyboard behavior and safe areas

## Documentation

* Update README.md if you add new features
* Add JSDoc comments for public functions
* Update type definitions
* Include examples in documentation

## Pull Request Process

1. **Before submitting:**
   - Test your changes thoroughly
   - Run TypeScript checks
   - Verify no console errors or warnings
   - Update documentation if needed

2. **Create a Pull Request:**
   - Use a clear title describing your changes
   - Reference any related issues (#123)
   - Provide a detailed description of changes
   - Include screenshots/videos for UI changes

3. **PR Review:**
   - Address feedback and suggestions
   - Keep discussion respectful
   - Request re-review after changes

4. **Merging:**
   - PRs are merged after approval
   - Squash commits for cleaner history
   - Delete your branch after merging

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

### Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors page

## Questions?

Feel free to ask questions by:
- Creating a discussion in GitHub Discussions
- Opening an issue with the `question` label
- Emailing the maintainers

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Thank you for contributing to Do-it! 🎉