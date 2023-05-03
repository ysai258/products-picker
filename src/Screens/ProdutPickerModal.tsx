import { Modal, Button, TreeProps, Input } from "antd";
import { FC, Key, useEffect, useState } from "react";
import Tree, { DataNode } from "antd/es/tree";
import { Product } from "../Types/Types";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
const BASE_URL = "https://stageapibc.monkcommerce.app/admin/shop";
interface Props {
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  replaceId: number;
}

const ProductPickerModal: FC<Props> = ({
  showModal,
  setModal,
  setData,
  replaceId,
}) => {
  interface RequiredProducts {
    [productId: number]: number[];
  }

  const getCheckedProducts = () => {
    const selectedProducst: RequiredProducts = {};
    checkedKeys.map((key) => {
      key = key.toString();
      if (key.includes("-")) {
        const [productId, variantId] = key.split("-").map(Number);
        if (selectedProducst[productId]) {
          selectedProducst[productId] = [
            ...selectedProducst[productId],
            variantId,
          ];
        } else {
          selectedProducst[productId] = [variantId];
        }
      }
    });
    return selectedProducst;
  };

  const handleOk = () => {
    const requiredProduts = getCheckedProducts();
    const filteredProducts: Product[] = productData
      .filter((product) => {
        const requiredVariants = requiredProduts[product.id];
        if (requiredVariants) {
          const filteredVariants = product.variants.filter((variant) =>
            requiredVariants.includes(variant.id)
          );
          return filteredVariants.length > 0;
        }
        return false;
      })
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant) =>
          requiredProduts[product.id]?.includes(variant.id)
        ),
      }));

    setData((prev) => {
      const temp: Product[] = [];
      let flag = true;
      prev.map((prevProduct) => {
        if (prevProduct.id == replaceId) {
          flag = false;
          filteredProducts.map((val) => temp.push(val));
        } else {
          temp.push(prevProduct);
        }
      });
      if (flag) {
        filteredProducts.map((val) => temp.push(val));
      }
      temp.forEach((v, ind) => (v.id = ind + 1));
      return temp;
    });

    setModal(false);
  };
  const handleCancel = () => {
    setModal(false);
  };

  const [productData, setProductData] = useState<Product[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product?search=${search}&page=1`
      );
      const data = await response.json();
      const tempArr: DataNode[] = [];

      setProductData(
        data?.map((val: Product) => {
          const tempNode: DataNode = {
            title: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <img
                  src={val?.image?.src}
                  height={36}
                  width={36}
                  style={{ borderRadius: 4, marginRight: 14 }}
                />
                {val.title}
              </div>
            ),
            style: {
              width: "100%",
              padding: "5px 0",
              borderTop: "1px solid #0000001A",
            },
            key: `${val.id}`,
            children: val.variants.map((variant) => {
              return {
                key: `${val.id}-${variant.id}`,
                style: {
                  width: "100%",
                  borderTop: "1px solid #0000001A",
                  padding: "5px 0",
                },
                title: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "10px 0",
                    }}
                  >
                    <div>{variant.title}</div>
                    <div>
                      {`${
                        variant.inventory_quantity
                          ? variant.inventory_quantity
                          : 0
                      } available $${variant.price}`}
                    </div>
                  </div>
                ),
              };
            }),
          };
          tempArr.push(tempNode);
          return val;
        })
      );

      setTreeData(tempArr);
    } catch (error) {
      console.log("error while fetch", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showModal) {
      fetchProducts();
    }
  }, [showModal]);

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchProducts(search);
    }, 400);
    return () => clearTimeout(getData);
  }, [search]);

  const onCheck: TreeProps["onCheck"] = (cKeys, info) => {
    cKeys = cKeys as Key[];
    setCheckedKeys(cKeys);
  };
  const resetModal = () => {
    setCheckedKeys([]);
  };
  return (
    <Modal
      afterClose={resetModal}
      destroyOnClose={true}
      title="Select Products"
      open={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {Object.keys(getCheckedProducts()).length > 0 &&
              `${Object.keys(getCheckedProducts()).length} product selected`}
          </div>
          <div>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleOk}>
              Add
            </Button>
          </div>
        </div>
      }
    >
      <div>
        <Input
          size="large"
          placeholder="Search Product"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <LoadingOutlined />
        ) : (
          <div className="productsTree">
            {treeData && treeData?.length > 0 ? (
              <Tree
                checkable={true}
                selectable={false}
                defaultExpandAll={true}
                autoExpandParent={true}
                onCheck={onCheck}
                treeData={treeData}
                height={350}
              />
            ) : (
              <div>No Products</div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductPickerModal;
