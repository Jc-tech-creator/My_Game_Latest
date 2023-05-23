import React, { useEffect, useState } from "react";

const Child = (props) => {
  // pass in props from parent
  const { msg, balance: parentBalance } = props; // destructing the passed props
  const [balance, setBalance] = useState(0); // initial balance is 0;

  useEffect(() => {
    console.log("componentDidUpdate/DidMount - Child Component");
    return () => {
      console.log("componentWillUnmount/clean up - Child Component");
    };
  });

  console.log("return -Child Component");
  return (
    <div>
      <p>this is Child Component</p>
      <p>Parent's balance : {parentBalance}</p>
      <p>Parent's msg: {msg}</p>
      <p>我的小金库: {balance}</p>

      <div>
        <button
          onClick={() => {
            setBalance(balance + 10);
          }}
        >
          我自己挣钱了
        </button>
      </div>
    </div>
  );
};

export default Child;
