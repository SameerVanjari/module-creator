import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import MandatoryMark from "./MandatoryCard";

const Radio = (props = { label, mandatory }) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="place-self-end h-full capitalize">
        {props.label} {JSON.parse(props.mandatory) && <MandatoryMark />}
      </Label>
      <RadioGroup
        defaultValue="comfortable"
        className="col-span-3"
        onValueChange={props.onChange}
      >
        {props.options?.map((item) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={item} id={item} />
            <Label htmlFor="r1">{item}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Radio;
