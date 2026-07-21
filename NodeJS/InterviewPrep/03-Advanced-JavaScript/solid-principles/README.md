# SOLID in JavaScript

SOLID is guidance for keeping change localized, not a mandate to create a class per noun.

- **Single responsibility:** separate report formatting from persistence and delivery.
- **Open/closed:** add a notifier through a small interface instead of modifying a central `switch`.
- **Liskov substitution:** a replacement must preserve caller expectations (including errors and async behavior).
- **Interface segregation:** accept only methods needed, such as `{ get(id) }`, rather than a giant service.
- **Dependency inversion:** inject adapters so domain logic depends on capabilities, not `fetch`, a database driver, or a global singleton.

```js
function createUserService({ userRepository, notifier }) {
  return {
    async register(input) {
      const user = await userRepository.create(input);
      await notifier.sendWelcome(user);
      return user;
    },
  };
}
```

This design is testable with fakes and allows storage/delivery replacement. Avoid ceremonial abstraction around stable, simple code.

## Interview checks

1. Demonstrate SRP with a real refactor.
2. Why can inheritance violate LSP?
3. How does dependency injection work without a DI container?
