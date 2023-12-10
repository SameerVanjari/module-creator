import React from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import MandatoryMark from "./MandatoryCard";

const TextArea = (props = { label, mandatory }) => {
  return (
    <div className="grid grid-cols-4 w-full gap-4">
      <Label htmlFor="message-2" className="place-self-end h-full capitalize">
        {props.label} {JSON.parse(props.mandatory) && <MandatoryMark />}
      </Label>
      <Textarea
        placeholder="Enter text"
        id="message-2"
        className="col-span-3 "
        {...props}
      />
    </div>
  );
};

export default TextArea;
