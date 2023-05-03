import { useState, useEffect, FC, useRef } from "react";
import DragTable from "../Components/Dragtable";
import { DiscountType, Product, Variant } from "../Types/Types";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import DiscountInput from "../Components/DiscountButton";
import { EditOutlined } from "@ant-design/icons";
import ProductPickerModal from "./ProdutPickerModal";

interface VaraintsTableProps {
  record: Product;
  setDataSource: React.Dispatch<React.SetStateAction<Product[]>>;
}
const defaultProdut: Product = {
  id: -1,
  title: "",
  image: { id: -1, product_id: -1, src: "" },
  variants: [],
};
const VaraintsTable: FC<VaraintsTableProps> = ({ record, setDataSource }) => {
  const [data, setData] = useState(record.variants);

  const deleteVariant = (variant: Variant) => {
    setData((prev) => {
      prev = prev.filter((val) => val.id != variant.id);
      return prev?.length > 0 ? prev : [];
    });
  };
  const varaintColumn: ColumnsType<Variant> = [
    {
      key: "sort",
    },
    {
      title: "",
      dataIndex: "title",
      render(variantValue, variantRecord, variantIndex) {
        const discount = variantRecord.discount;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                minWidth: 185,
                border: "1px solid #00000012",
                borderRadius: 30,
                borderColor: "#00000012",
                alignItems: "center",
                padding: 10,
                marginRight: 12,
              }}
            >
              {variantValue}
            </div>
            {discount ? (
              <div>
                <DiscountInput
                  discount={discount}
                  onValueChange={(val) => {
                    if (variantRecord.discount)
                      variantRecord.discount.value = val;
                  }}
                  onTypeChange={(type) => {
                    if (variantRecord.discount)
                      variantRecord.discount.type = type;
                  }}
                  valueStyle={{ borderRadius: 30 }}
                  typeStyle={{ borderRadius: 30 }}
                />
              </div>
            ) : (
              <Button
                onClick={() => {
                  setData((prevData) => {
                    return prevData.map((val) => {
                      if (val.id == variantRecord.id) {
                        val.discount = { type: "percentage", value: 0 };
                      }
                      return val;
                    });
                  });
                }}
              >
                Add Discount
              </Button>
            )}
            <Button
              type="text"
              onClick={() => deleteVariant(variantRecord)}
              style={{ color: "#00000066" }}
            >
              X
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (data.length == 0) {
      setDataSource((prevData) => {
        prevData = prevData.filter((dataVal) => dataVal.id != record.id);
        return prevData?.length > 0 ? prevData : [defaultProdut];
      });
    } else {
      setDataSource((prev) => {
        return prev.map((val) => {
          if (val.id == record.id) {
            val.variants = [...data];
          }
          return val;
        });
      });
    }
  }, [data]);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <DragTable
        columns={varaintColumn}
        dataSource={data}
        setDataSource={setData}
        showHeader={false}
      />
    </div>
  );
};
interface DiscountSectionProps {
  record: Product;
  setDataSource: React.Dispatch<React.SetStateAction<Product[]>>;
}
const DiscountSection: FC<DiscountSectionProps> = ({
  record,
  setDataSource,
}) => {
  const discount = record.discount;
  const handleValueChange = (value: number) => {
    setDataSource((prev) => {
      return prev.map((val) => {
        if (val.id == record.id) {
          if (val.discount) {
            val.discount.value = value;
            val.variants.forEach((varaint) => {
              if (val.discount) {
                varaint.discount = { ...val.discount };
              }
            });
          }
        }
        return val;
      });
    });
  };
  const handleTypeChange = (type: DiscountType) => {
    setDataSource((prev) => {
      return prev.map((val) => {
        if (val.id == record.id) {
          if (val.discount) {
            val.discount.type = type;
            val.variants.forEach((varaint) => {
              if (val.discount) {
                varaint.discount = { ...val.discount };
              }
            });
          }
        }
        return val;
      });
    });
  };

  const deleteProduct = () => {
    setDataSource((prevData) => {
      prevData = prevData.filter((dataVal) => dataVal.id != record.id);
      return prevData;
    });
  };

  return (
    <div style={{ display: "flex" }}>
      {discount ? (
        <DiscountInput
          discount={discount}
          onValueChange={handleValueChange}
          onTypeChange={handleTypeChange}
        />
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setDataSource((prev) => {
              return prev.map((val) => {
                if (val.id == record.id) {
                  val.discount = { type: "percentage", value: 0 };
                  val.variants.forEach((varaint) => {
                    varaint.discount = { type: "percentage", value: 0 };
                  });
                }
                return val;
              });
            });
          }}
        >
          Add Discount
        </Button>
      )}
      {record.id > 0 && (
        <Button
          type="text"
          onClick={() => deleteProduct()}
          style={{ color: "#00000066" }}
        >
          X
        </Button>
      )}
    </div>
  );
};

const Varaints: FC<DiscountSectionProps> = ({ record, setDataSource }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div>
      {record.id > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              setShow((prev) => !prev);
            }}
            type="text"
            style={{
              color: "#006EFF",
            }}
          >
            <span style={{ marginRight: 2 }}>
              <u>{`${!show ? "show" : "hide"} variants `}</u>
            </span>
            <span style={{ rotate: `${show ? 90 : -90}deg` }}>{">"}</span>
          </Button>
        </div>
      )}
      {show && (
        <div>
          <VaraintsTable record={record} setDataSource={setDataSource} />
        </div>
      )}
    </div>
  );
};
const Home = () => {
  const [dataSource, setDataSource] = useState<Product[]>([defaultProdut]);

  const addIndex = useRef<number>(-1);
  const showProducts = (index: number) => {
    addIndex.current = index;
    setSelectProducts(true);
  };
  const [selectProducts, setSelectProducts] = useState<boolean>(false);

  const columns: ColumnsType<Product> = [
    {
      key: "sort",
      title: <div></div>,
      className: "sortKey",
    },
    {
      title: "Product",
      dataIndex: "title",
      render(value, record, index) {
        return (
          <div
            style={{ borderBottom: record.id > 0 ? "1px solid #0000001A" : "" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {index + 1}.
              <Button
                onClick={() => showProducts(record.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 8,
                  marginRight: 15,
                  borderColor: "#00000012",
                }}
              >
                <div style={{ width: 215, display: "flex" }}>
                  {value ? (
                    <span
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {value}
                    </span>
                  ) : (
                    <span style={{ color: "#00000080" }}>Select Product</span>
                  )}
                </div>
                <EditOutlined style={{ color: "#00000033" }} />
              </Button>
              <DiscountSection record={record} setDataSource={setDataSource} />
            </div>
            <Varaints record={record} setDataSource={setDataSource} />
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        {dataSource && dataSource.length > 0 ? (
          <div>
            <div
              style={{ display: "flex", justifyContent: "center", margin: 20 }}
            >
              Add Products
            </div>
            <DragTable
              columns={columns}
              dataSource={dataSource}
              setDataSource={setDataSource}
            />
          </div>
        ) : (
          <div>No Products</div>
        )}
        <div style={{ position: "absolute", bottom: -40, right: 0 }}>
          <Button
            onClick={() => showProducts(-1)}
            style={{
              color: "#008060",
              borderWidth: 2,
              borderColor: "#008060",
              borderRadius: 4,
            }}
          >
            Add Product
          </Button>
        </div>
      </div>
      <ProductPickerModal
        showModal={selectProducts}
        setModal={setSelectProducts}
        setData={setDataSource}
        replaceId={addIndex.current}
      />
    </div>
  );
};
export default Home;
