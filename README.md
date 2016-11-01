
# React AARS [![npm](https://img.shields.io/npm/v/react-aars.svg)](https://www.npmjs.com/package/react-aars)

**A**PIs, **A**ctions, **R**educers, and **S**agas

These 4 things are usually common and almost identical in almost every route or component, like `/login`, `user`, `creditCard` etc.

The following encapsulates all of the boilerplate code that goes with defining these 4 components separately for every use case.

## Components

```js
createComponent({name: 'user'})
```

This creates

  * API: Request which will fetch results from '/user' (assuming such a route is defined on server)
  * Actions: The 3 standard actions: `userRequest`, `userSuccess`, and `userFailure`. `userRequest` action actually calls the API.
  * Reducers: The 3 corresponding and interlinked reducers for above actions.
  * Sagas: Takes every `userRequest`, which makes the API request, and according to the result, emits either `userSuccess` or `userFailure` action which use the corresponding Reducers to sets the result in the state object.

The state data are like

```js
{
  data: null || { ... },
  // The data fetched from API (null initially or when unsuccessful)

  requestData: { ... },
  // The data sent to fetch API

  isFetching: true/false,
  // True on userRequest, false on userSuccess or userFailure

  error: null,
  // Error message on userFailure

  result: null
  // Like data, but used in crud (seen later)
}
```

With this you can simply have in your `AccountView.js`:


```js
static propTypes = {
  user: React.PropTypes.object.isRequired
}

componentWillMount () {
  this.props.user.actions.request({send: 'some data if needed'});
}

render () {
  const user = this.props.user.data;
}
```

## CRUD Components

```js
createCRUDComponent({ name: 'user' })
```


This is an extension of [`createComponent`](#createComponent).

This creates

  * 4 API routes:
    ```
    /user/create
    /user/read
    /user/update
    /user/remove
    ```
  * 3 actions:

    - `userCreateRequest({...data})`
    - `userCreateSuccess({...token})`
    - `userCreateFailure({...error})`

      All 3 for each of the 4 corresponding CRUD operations (so total 12).

      `userCreateRequest()` calls the route `/user/create`, and so on.

  * Simiarly 12 Reducers

And finally

  * 4 Sagas


## Authentication

`createComponent` lets you specify actions hooks such as:

* `actions.success`

    When `/login` is requested and server send back a token, you can do stuff with in on success.

    ```js
    createComponent({
      name: 'login',
      actions: {
        success (data) {
          localStorage.setItem('token', data.token)
        }
      }
    })
    ```

* `actions.request`

    Similarly you can set jwt authorization header token on request

    ```js
    createCRUDComponent({
      name: 'user',
      actions: {
        request (data) {
          return {
            authorization: localStorage.getItem('token'),
            ...data
          }
        }
      }
    })
    ```

The [fetch-api](../api/rest-api-request.js) takes care of appending authorization "bearer" text as a header.


## [AARS Components](components.js)

All AARS Components are defined in `client/src/app/AARS/components.js`

It also has `/actions.js`, `/sagas.js` etc. that gives you only the `actions`, and sagas respectively of all components. They're used in [root reducers](../reducers/index.js) and ActionToProps etc.


