import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import MandatoryMark from "./MandatoryCard";

const SelectField = (props = { label, mandatory }) => {
  return (
    <div className="grid grid-cols-4 gap-4 items-center">
      <Label>
        {props.label} {JSON.parse(props.mandatory) && <MandatoryMark />}
      </Label>
      <div className="col-span-3 my-3">
        <Select onValueChange={props.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {props.options?.map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectField;
