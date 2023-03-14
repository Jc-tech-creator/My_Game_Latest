import React, { useState, useEffect } from "react";
import Child from "./Child";

const Parent = () => {
  const [showChild, setShowChild] = useState(false); // false is initial state
  const [balance, setBalance] = useState(100); // 100 is initial balance

  //Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    console.log("componentDidUpdate/DidMount - Parent Component", balance);
    //return is optional,Similar to componentWillUnmount
    //clean up function
    return () => {
      console.log("componentWillUnmount/clean up - Parent component", balance);
    };
  });
  console.log("return - Parent Component");
  return (
    <div>
      <h3>Function Component</h3>
      <p>this is Parent Component</p>
      <p>balance: {balance}</p>
      <div>
        <button
          onClick={() => {
            setShowChild(!showChild);
          }}
        >
          click me to create/destory Child component
        </button>
      </div>

      <div>
        <button
          onClick={() => {
            setBalance(balance + 10);
          }}
        >
          挣了10 USD
        </button>
      </div>

      <hr />

      {showChild ? (
        <Child balance={balance} msg="hello function component!" /> // pass the props to child component
      ) : null}
    </div>
  );
};

export default Parent;
// const Parent = () => {
//   const [showChild, setShowChild] = useState(false);
//   const [balance, setBalance] = useState(100);

//   // Similar to componentDidMount and componentDidUpdate
//   useEffect(() => {
//     console.log("componentDidUpdate/DidMount - Parent Component", balance);
//     // return is Optional. Similar to componentWillUnmount
//     // clean up function
//     return () => {
//       console.log("componentWillUnmount - Parent Component", balance);
//     };
//   });

//   console.log("render() - Parent Component");
//   return (
//     <div>
//       <h3>Function Components</h3>
//       <p>this is Parent Component</p>
//       <p>balance: {balance}</p>
//       <div>
//         <button
//           onClick={() => {
//             setShowChild(!showChild);
//           }}
//         >
//           click me to create/destory Child component
//         </button>
//       </div>

//       <div>
//         <button
//           onClick={() => {
//             setBalance(balance + 10);
//           }}
//         >
//           挣了10 USD
//         </button>
//       </div>

//       <hr />

//       {/* {this.state.showChild ? (
//             <Child balance={this.state.balance} msg="hello world" />
//           ) : null} */}
//     </div>
//   );
// };

// export default Parent;
