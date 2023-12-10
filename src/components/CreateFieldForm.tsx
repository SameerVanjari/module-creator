import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useFormik } from "formik";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModules } from "@/services/api.service";
import _ from "lodash";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";

const CreateFieldForm = ({ module, currentBlock }: any) => {
  const queryClient = useQueryClient();
  const [optionList, setOptionList] = useState<string[]>([]);
  const updateModuleMut = useMutation({
    mutationFn: updateModules,
    onSuccess: (data) => {
      // setModuleName(data.data);
      queryClient.invalidateQueries({ queryKey: ["module-id"] });
    },
  });

  const createFieldForm = useFormik({
    initialValues: {
      label: "",
      type: "",
      isMandatory: false,
      defaultValue: "",
      options: [],
    },
    onSubmit: (data) => {
      //   setBlocks([...blocks, data]);
      const newblock = {
        ...currentBlock,
        fields: [...currentBlock.fields, data],
      };
      const newData = _.unionBy([newblock], module.blocks, "name");
      //   const newModule = _.unionBy([])
      updateModuleMut.mutate({ ...module, blocks: newData });
      createFieldForm.resetForm();
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Plus size={18} /> Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
          <DialogDescription>Add Custom Fields to your block</DialogDescription>
        </DialogHeader>
        <form onSubmit={createFieldForm.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label
              </Label>
              <Input
                id="label"
                value={createFieldForm.values.label}
                name="label"
                onChange={createFieldForm.handleChange}
                placeholder="Enter a block name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-end">Type</Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(e: string) =>
                    createFieldForm.setFieldValue("type", e)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Checkbox
                id="terms"
                className=" place-self-end"
                onCheckedChange={(e) =>
                  createFieldForm.setFieldValue("isMandatory", e)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium col-span-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Mandatory
              </label>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defaultValue" className="text-right">
                Default Value
              </Label>
              <Input
                id="defaultValue"
                value={createFieldForm.values.defaultValue}
                name="defaultValue"
                onChange={createFieldForm.handleChange}
                placeholder="Enter a default value"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 ">
              <Label htmlFor="defaultValue" className="text-right">
                Options
              </Label>
              <div className="col-span-3">
                <TagsInput
                  value={optionList}
                  onChange={(tags) => {
                    setOptionList(tags);
                    createFieldForm.setFieldValue("options", tags);
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFieldForm;
