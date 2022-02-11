# GUIDELINES & NAMING CONVENTIONS

## Action naming guidelines

Action names should follow the convention `<FEATURE>:[<SUB_COMPONENT>:]<VERB>[_<INTERMEDIATE-ACTION>]`

where

<FEATURE>           - Name of the feature or entity of the action
<SUB_COMPONENT>       - Optional - Name of the sub component or sub-feature
<VERB>                - The actual action why this action is dispatched
<INTERMEDIATE-ACTION> - Optional - Actions for intermediate results or states that the saga dispatches as part of its execution

Examples

* LOGIN:DO_LOGIN - Login is the <FEATURE> and DO_LOGIN is the <VERB>
* USER:DETAIL:UPDATE - USER is the <FEATURE>, DETAIL is a <SUB_COMPONENT> and UPDATE is the <VERB>
* CLIENTS:LIST:REQUEST_SUCCESS -  CLIENTS is the <FEATURE>, LIST is a <SUB_COMPONENT> and REQUEST is the <VERB> and SUCCESS is the intermediate result

## Reducer Guidelines

### Reducers should use immutable
### Separate reducers should be return in cases where a container has subcomponents
### All reducers of a container should be aggregated into a single reducer and exported as reducers
### The top level exported reducer of a container should be added into the root reducer at /reducers/index.js
