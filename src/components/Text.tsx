import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import MandatoryMark from "./MandatoryCard";

const Text = (props = { label, mandatory }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={props.label} className="text-right">
        {props.label} {JSON.parse(props.mandatory) && <MandatoryMark />}
      </Label>
      <Input
        id={props.label}
        name={props.name}
        className="col-span-3"
        {...props}
      />
    </div>
  );
};

export default Text;
