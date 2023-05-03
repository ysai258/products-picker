import { CSSProperties, FC, useEffect, useState } from "react";
import { Discount, DiscountType } from "../Types/Types";
import { Input, Select } from "antd";

interface Props {
  discount: Discount;
  onValueChange: (value: number) => void;
  onTypeChange: (type: DiscountType) => void;
  valueStyle?: CSSProperties;
  typeStyle?: CSSProperties;
}
const DiscountInput: FC<Props> = ({
  discount,
  onValueChange,
  onTypeChange,
  valueStyle,
  typeStyle,
}) => {
  const [value, setValue] = useState(discount.value);
  const [type, setType] = useState(discount.type);

  useEffect(() => {
    setValue(discount.value);
    setType(discount.type);
  }, [discount]);

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
    <div style={{ display: "flex" }}>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const enterValue = e.target.value ? parseInt(e.target.value) : 0;
          setValue(enterValue);
          onValueChange(enterValue);
        }}
        style={{
          borderRadius: 0,
          borderColor: "#0000001A",
          width: 70,
          marginRight: 5,
          ...valueStyle,
        }}
      />
      <div
        style={{ border: "1px solid #0000001A", borderRadius: 0, ...typeStyle }}
      >
        <Select
          defaultValue="% Off"
          value={type}
          onChange={(val) => {
            const selectedType = val as DiscountType;
            setType(selectedType);
            onTypeChange(selectedType);
          }}
          options={options}
          bordered={false}
          style={{ width: 95, ...typeStyle }}
        />
      </div>
    </div>
  );
};

export default DiscountInput;
