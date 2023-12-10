import CreateFieldForm from "@/components/CreateFieldForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModuleById, updateModules } from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import _ from "lodash";
import { Minus, Plus, Trash, X } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

const EditModule = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const getModuleQ = useQuery({
    queryKey: ["module-id"],
    queryFn: () => getModuleById(params.name as string),
  });
  const currentModule = getModuleQ.isSuccess ? getModuleQ.data.data : {};

  const updateModuleMut = useMutation({
    mutationFn: updateModules,
    onSuccess: (data) => {
      // setModuleName(data.data);
      queryClient.invalidateQueries({ queryKey: ["module-id"] });
    },
  });

  const createBlockForm = useFormik({
    initialValues: {
      name: "",
      addAfter: "",
      fields: [],
    },
    onSubmit: (data) => {
      //   setBlocks([...blocks, data.name]);
      const copyArr = currentModule.blocks;
      let index = -2;
      copyArr.map((item, i) => {
        if (item.name == data.addAfter) {
          index = i;
        }
      });
      copyArr.splice(index + 1, 0, data);
      const newData = {
        ...currentModule,
        blocks: copyArr,
      };
      updateModuleMut.mutate(newData);

      createBlockForm.resetForm();
    },
  });

  const handleBlockRemove = (block) => {
    const blocks = _.cloneDeep(currentModule.blocks);
    _.remove(blocks, function (i) {
      return block.name == i.name;
    });

    updateModuleMut.mutate({ ...currentModule, blocks: blocks });
  };

  const handleFieldRemove = (field, block) => {
    const selectedBlock = currentModule.blocks.filter(
      (i) => i.name == block.name
    )[0];
    const fieldsCopy = selectedBlock.fields;
    _.remove(fieldsCopy, function (f) {
      return f.label == field.label;
    });

    selectedBlock.fields = fieldsCopy;

    const updated = _.union(currentModule.blocks, [selectedBlock], "name");

    updateModuleMut.mutate({ ...currentModule, blocks: updated });
  };

  return (
    <div className="p-6">
      {getModuleQ.isSuccess && (
        <>
          <div className="flex space-x-12 items-center">
            <h3 className="text-lg font-semibold ">{currentModule?.name}</h3>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="space-x-2">
                  <Plus size={18} /> block
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Block</DialogTitle>
                  <DialogDescription>
                    Add blocks to your module
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createBlockForm.handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={createBlockForm.values.name}
                        name="name"
                        onChange={createBlockForm.handleChange}
                        placeholder="Enter a block name"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <Label>Add After</Label>
                    <div className="col-span-3 my-3">
                      <Select
                        onValueChange={(e: string) =>
                          createBlockForm.setFieldValue("addAfter", e)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentModule.blocks.map((item) => (
                            <SelectItem value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
          </div>
          <div className="py-4 space-y-4">
            {currentModule?.blocks?.map((item) => (
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex w-full justify-between">
                    {item.name}{" "}
                    <div className="flex space-x-2">
                      <CreateFieldForm
                        module={currentModule}
                        currentBlock={item}
                      />
                      <Button
                        onClick={() => handleBlockRemove(item)}
                        variant={"destructive"}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.fields?.map((field: any) => (
                    <div className="grid grid-cols-5">
                      <div className="flex space-x-2">
                        <p className="font-medium">
                          Label: <strong>{field.label}</strong>
                        </p>
                        <p></p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-medium">
                          Type: <strong>{field.type}</strong>
                        </p>
                        <p></p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-medium capitalize">
                          Is Mandatory:{" "}
                          <strong>
                            {field.isMandatory ? "true" : "false"}
                          </strong>
                        </p>
                        <p></p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-medium capitalize">
                          default value:{" "}
                          <strong>{field.defaultValue || "-"}</strong>
                        </p>
                        <p></p>
                      </div>
                      <Trash
                        size={16}
                        onClick={() => {
                          handleFieldRemove(field, item);
                        }}
                        className="text-red-500 place-self-end cursor-pointer"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EditModule;
