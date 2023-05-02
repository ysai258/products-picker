import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { FC } from "react";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleY: 1 }
    )?.replace(/translate3d\(([^,]+),/, "translate3d(0,"),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <div
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                {...listeners}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>⋮</span>
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>⋮</span>
                </div>
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

interface Props<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>;
}

const DragTable: FC<Props<any>> = ({ columns, dataSource, setDataSource }) => {
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.id === active.id);
        const overIndex = previous.findIndex((i) => i.id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DragTable;
