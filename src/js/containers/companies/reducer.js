import Immutable from 'seamless-immutable';

const defaultState = Immutable.flatMap({
  companiesList: []
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'ss':
      return state;
    default:
      return state;
  }
};
