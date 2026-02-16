import { Button } from "antd";
import { type } from "node:os";

const ColorifyGeneralButton = ({ childern, type = primary, ...props }) => {
  return (
    <Button type={type} {...props}>
      {childern}
    </Button>
  );
};

export default ColorifyGeneralButton;
