[![npm version](https://img.shields.io/npm/v/@itrocks/required?logo=npm)](https://www.npmjs.org/package/@itrocks/required)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/required)](https://www.npmjs.org/package/@itrocks/required)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/required?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/required)
[![issues](https://img.shields.io/github/issues/itrocks-ts/required)](https://github.com/itrocks-ts/required/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# required

@Required decorator to enforce mandatory properties in data validation.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/required
```

## Usage

`@itrocks/required` provides a property decorator `@Required()` that lets you
mark properties as mandatory for validation or UI purposes.

The decorator itself does not throw validation errors. Instead, it stores a
`required` metadata flag that other parts of the framework – or your own code –
can read to decide whether a field must be filled in (for example when
rendering a form or validating a request body).

You can read this metadata using the helper function `requiredOf`, either on a
class constructor or on an instance.

### Minimal example

```ts
import { Required } from '@itrocks/required'

class User {
  @Required()
  email = ''
}
```

Here, the `email` property is marked as required. Any component that knows how
to read the decorator metadata will be able to treat this field as mandatory.

### Complete example with validation and UI

In a typical application, this package is used together with higher-level
components (such as `@itrocks/framework` and `@itrocks/core-transformers`)
which read the `required` metadata to generate forms and perform validation.

The following example shows a simplified, standalone usage:

```ts
import type { ObjectOrType } from '@itrocks/class-type'
import { Required, requiredOf } from '@itrocks/required'

class Account {
  @Required()
  name = ''

  @Required(false)
  comment?: string
}

function isPropertyRequired<T extends object>(
  target: ObjectOrType<T>,
  property: keyof T
): boolean {
  return requiredOf(target, property)
}

// true
const nameIsRequired = isPropertyRequired(Account, 'name')

// false (explicitly marked as not required)
const commentIsRequired = isPropertyRequired(Account, 'comment')

// Minimal example of how this could be used when rendering a form
function renderLabel<T extends object>(
  target: ObjectOrType<T>,
  property: keyof T,
  text: string
): string {
  return isPropertyRequired(target, property) ? `${text} *` : text
}

// "Name *"
const label = renderLabel(Account, 'name', 'Name')
```

In real applications based on the `@itrocks` ecosystem, you will usually not
call `requiredOf` directly; it is used internally when generating HTML inputs
or computing UI metadata. However, you can still rely on it whenever you need
to know if a field has been declared as mandatory.

## API

### `function Required<T extends object>(value?: boolean): DecorateCaller<T>`

Property decorator used to declare whether a given property is required.

#### Parameters

- `value` *(optional)* – when `true` (default), the property is marked as
  required. When `false`, the property is explicitly marked as not required,
  which can be useful to override a default behaviour in your framework or
  tooling.

#### Return value

- `DecorateCaller<T>` – function from `@itrocks/decorator/property` used by the
  TypeScript decorator system. In practice, you just apply `@Required()` on a
  property and do not call this function directly.

#### Examples

```ts
class Customer {
  // Required by default
  @Required()
  email = ''

  // Explicitly not required (for example, optional phone number)
  @Required(false)
  phone?: string
}
```

---

### `function requiredOf<T extends object>(
  target: ObjectOrType<T>,
  property: KeyOf<T>
): boolean`

Reads the `@Required()` metadata for a given property.

If the property has been decorated with `@Required()`, this function returns
the boolean value passed to the decorator (or `true` when no value was
provided). If there is no decorator on the property, `requiredOf` returns
`false`.

This helper is heavily used inside `@itrocks/framework` to determine whether a
field should be considered mandatory when building views or validating input
data.

#### Parameters

- `target` – the class (e.g. `Account`) or instance (`new Account()`) that owns
  the property.
- `property` – the name of the property you want to inspect.

#### Return value

- `boolean` – `true` if the property is marked as required, otherwise `false`.

#### Example

```ts
import type { ObjectOrType } from '@itrocks/class-type'
import { Required, requiredOf } from '@itrocks/required'

class Order {
  @Required()
  reference = ''

  @Required(false)
  internalNote?: string
}

function listRequiredProperties<T extends object>(
  type: ObjectOrType<T>,
  properties: (keyof T)[]
): (keyof T)[] {
  return properties.filter(property => requiredOf(type, property))
}

// ['reference']
const requiredProps = listRequiredProperties(Order, ['reference', 'internalNote'])
```

## Typical use cases

- Mark domain model properties (e.g. `email`, `name`, `password`) as mandatory
  and let your UI or validation layer enforce this constraint.
- Automatically add visual indicators (such as an asterisk `*`) on required
  fields when generating forms from your models.
- Drive server-side or client-side validation rules from decorators instead of
  duplicating the same knowledge in multiple layers.
- Combine with other `@itrocks/*` packages (such as `@itrocks/framework`,
  `@itrocks/core-transformers` or `@itrocks/property-view`) so that required
  metadata is taken into account when building views, APIs or storage
  configurations.
- Build generic helpers that inspect your models with `requiredOf` to generate
  JSON schemas, OpenAPI descriptions or documentation.
