import { useState, useEffect, FC, useRef } from "react";
import DragTable from "../Components/Dragtable";
import { DiscountType, Product, Variant } from "../Types/Types";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import DiscountInput from "../Components/DiscountButton";
import { EditOutlined } from "@ant-design/icons";
import ProductPickerModal from "./ProduPickerModal";

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

  const deleteVariant = (variant:Variant)=>{
    setData((prev)=>{
      prev = prev.filter((val)=>val.id!=variant.id);
      return prev?.length>0 ? prev:[] 
    })
  }
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>{variantValue}</div>
            {discount ? (
              <div>
                <DiscountInput
                  discount={discount}
                  onValueChange={(val) => (variantRecord.discount.value = val)}
                  onTypeChange={(type) => (variantRecord.discount.type = type)}
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
            <Button onClick={()=>deleteVariant(variantRecord)}>X</Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if(data.length==0){
      setDataSource((prevData)=>{
         prevData = prevData.filter((dataVal)=>dataVal.id!=record.id)
         return prevData?.length>0?prevData:[defaultProdut]
      })  
    }else{
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
    <div>
      <DragTable
        columns={varaintColumn}
        dataSource={data}
        setDataSource={setData}
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
    if (record.discount) record.discount.value = value;
    record.variants.forEach((val)=>{
      if(record.discount){
        val.discount.value=value;
      }
    })
  };
  const handleTypeChange = (type: DiscountType) => {
    if (record.discount) record.discount.type = type;
    record.variants.forEach((val)=>{
      if(record.discount){
        val.discount.type=type;
      }
    })

  };

  const deleteProduct = ()=>{
    setDataSource((prevData)=>{
      prevData = prevData.filter((dataVal)=>dataVal.id!=record.id)
      return prevData
   })
  }

  return (
    <div>
      {discount ? (
        <DiscountInput
          discount={discount}
          onValueChange={handleValueChange}
          onTypeChange={handleTypeChange}
        />
      ) : (
        <Button
          onClick={() => {
            setDataSource((prev) => {
              return prev.map((val) => {
                if (val.id == record.id) {
                  val.discount = { type: "percentage", value: 0 };
                  val.variants.forEach((varaint)=>{
                    varaint.discount={type:"percentage",value:0};
                  })
                }
                return val;
              });
            });
          }}
        >
          Add Discount
        </Button>
      )}
       {record.id > 0 && <Button onClick={()=>deleteProduct()}>X</Button> }
    </div>
  );
};

const Varaints: FC<DiscountSectionProps> = ({ record, setDataSource }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div>
      {record.id > 0 && (
        <div>
          <Button
            onClick={() => {
              setShow((prev) => !prev);
            }}
          >
            {`${!show ? "show" : "hide"} variants`}
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
    addIndex.current=index;
    setSelectProducts(true);
  };
  const [selectProducts, setSelectProducts] = useState<boolean>(false);

  const columns: ColumnsType<Product> = [
    {
      key: "sort",
    },
    {
      title: "Product",
      dataIndex: "title",
      render(value, record, index) {
        return (
          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button onClick={() => showProducts(record.id)}>
                {value ? value : "select product"}
                <EditOutlined />
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
    <div>
      Products
      <DragTable
        columns={columns}
        dataSource={dataSource}
        setDataSource={setDataSource}
      />

      <Button onClick={() => showProducts(-1)}>
        Add Product
      </Button>
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
