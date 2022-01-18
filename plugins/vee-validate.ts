import { extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

// with typescript
for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  })
}
