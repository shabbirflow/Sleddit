import { FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "../ui/Table";

const TableComponent: FC<any> = (props) => {
  const { data } = props;

  return (
    <div>
      <Table>
        <TableBody>
          {data.content.map((x: any, ind: number) => {
            return (
              <TableRow key={`row${ind}`}>
                {x.map((ele: string, index: number) => {
                  return (
                    <TableCell key={`cell${index}row${ind}`}>{ele}</TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
