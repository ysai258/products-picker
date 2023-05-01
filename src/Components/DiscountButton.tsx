import { FC, useState } from "react";
import { Discount, DiscountType } from "../Types/Types";
import { Space, Input, Select } from "antd";

interface Props{
    discount : Discount;
    onValueChange:(value:number)=>void;
    onTypeChange:(type:DiscountType)=>void;
}
const DiscountInput :FC<Props> = ({discount,onValueChange,onTypeChange}) => {
    const [value, setValue] = useState(discount.value);
    const [type, setType] = useState(discount.type);

    const options = [
      {
        value: "flat",
        label: "Flat Off",
      },
      {
        value: "percentage",
        label: "% Off",
      },
    ];
    return (
      <Space wrap>
        <Space.Compact>
          <Input
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const enterValue = e.target.value
                ? parseInt(e.target.value)
                : 0;
                setValue(enterValue);
                onValueChange(enterValue);
            }}
          />
          <Select
            style={{ width: 120 }}
            defaultValue="% Off"
            value={type}
            onChange={(val) => {
              const selectedType = val as DiscountType;
              setType(selectedType);
              onTypeChange(selectedType)
            }}
            options={options}
          />
        </Space.Compact>
      </Space>
    );
  };

export default DiscountInput;