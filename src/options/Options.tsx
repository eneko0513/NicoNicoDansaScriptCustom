import React, { useState } from "react";
import defaultValue from "@/libraries/localStorage.defaultValue";
import { localStorageKeys, localStorageOptionItem } from "@/@types/types";
import localStorage from "@/libraries/localStorage";
import Styles from "./Options.module.scss";

const Options = () => {
  const [value, setValue] = useState(
      (Object.keys(defaultValue) as localStorageKeys[]).reduce((pv, key) => {
        if (!key.match(/^options_/)) return pv;
        pv[key] = localStorage.get(key);
        return pv;
      }, {} as { [key in localStorageKeys]: string })
    ),
    updateValue = (key: localStorageKeys, result: string) => {
      value[key] = result;
      setValue({ ...value });
      localStorage.set(key, result);
    };
  return (
    <div className={Styles.wrapper}>
      {(Object.keys(value) as localStorageKeys[]).map((key) => {
        const defValue = defaultValue[key] as localStorageOptionItem;
        if (defValue.required && localStorage.get(defValue.required) !== "true")
          return <div key={key}></div>;
        switch (defValue.type) {
          case "boolean":
            return (
              <div className={Styles.bool} key={key}>
                <label>
                  <input
                    type="checkbox"
                    checked={value[key] === "true"}
                    onChange={() =>
                      updateValue(key, value[key] === "true" ? "false" : "true")
                    }
                  />
                  <span>{defValue.description}</span>
                </label>
              </div>
            );
          case "string":
            return (
              <div className={Styles.string} key={key}>
                <label>
                  <p>{defValue.description}</p>
                  <input
                    type="text"
                    onChange={(e) => updateValue(key, e.target.value)}
                    value={value[key]}
                  />
                </label>
              </div>
            );
          case "number":
            return (
              <div className={Styles.number} key={key}>
                <label>
                  <p>{defValue.description}</p>
                  <input
                    type="number"
                    onChange={(e) => updateValue(key, e.target.value)}
                    value={value[key]}
                  />
                </label>
              </div>
            );
        }
      })}
    </div>
  );
};
export default Options;
