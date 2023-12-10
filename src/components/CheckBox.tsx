import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import MandatoryMark from "./MandatoryCard";

const CheckBox = (props = { label, mandatory }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Checkbox
        id={props.label}
        name={props.name}
        className="place-self-end"
        {...props}
      />
      <Label htmlFor={props.label} className="col-span-3">
        {props.label} {JSON.parse(props.mandatory) && <MandatoryMark />}
      </Label>
    </div>
  );
};

export default CheckBox;
