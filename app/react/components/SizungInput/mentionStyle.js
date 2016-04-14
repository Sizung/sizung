export default (props={}) => ({
  control: {
    display: 'inline-block',
    width: '100%',
    minHeight: 40,
    backgroundColor: '#fff',
  },

  highlighter: {
    padding: 9,
  },

  textarea: {
    margin: 0,
    padding: 9,
    minHeight: 40,
    outline: 0,
  },

  input: {
    padding: 1,
    margin: 0,
    border: '2px inset',
  },

  suggestions: {
    border: '1px solid rgba(0,0,0,0.15)',
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
});