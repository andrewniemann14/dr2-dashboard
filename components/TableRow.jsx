

const TableRow = ({props}) => {
  return (
    <tr>
      {Object.keys(props).map((cell, i) => {
        return (
          <td key={i}>
            {props[cell]}
          </td>
        )
      })}
    </tr>
  )
}

export default TableRow




// props: {
//   id: 550709,
//   start: '2022-02-01T10:00:00Z',
//   end: '2022-02-02T10:10:00Z',
//   country: '',
//   stage: 'North Fork Pass Reverse',
//   vehicle_class: 'eRallyH3RwdCaps'
// }