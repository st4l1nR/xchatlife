import React from "react";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import Base from "../molecules/Base";
import { type BaseProps } from "../molecules/Base";
const ListBase = ({
  loading: _loading,
  totalDocs: _totalDocs,
  items,
}: {
  loading: boolean;
  totalDocs: number;
  items: BaseProps[];
}) => {
  return (
    <WrapperLoader loading={false} totalDocs={0}>
      <div>
        {items.map((item, key) => (
          <Base key={key} {...item} />
        ))}
      </div>
      <>Add loading skeleton</>
      <CardEmptyState></CardEmptyState>
    </WrapperLoader>
  );
};

export default ListBase;
