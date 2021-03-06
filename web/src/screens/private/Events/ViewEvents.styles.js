export default theme => ({
  root: {
    margin: 30,
  },
  actionPanel: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflowX: 'auto',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 700,
  },
  tableToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 40,
  },
  tableCell: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
