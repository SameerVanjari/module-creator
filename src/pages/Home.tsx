import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormik } from "formik";
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
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createModules,
  getModuleById,
  updateModules,
} from "@/services/api.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const Home = () => {
  const queryClient = useQueryClient();
  const [moduleName, setModuleName] = useState(null);
  const [blocks, setBlocks] = useState<string[]>([]);

  const createModuleMut = useMutation({
    mutationFn: createModules,
    onSuccess: (data) => {
      setModuleName(data.data);
      queryClient.invalidateQueries({ queryKey: ["modules-name-list"] });
      toast.success("Module created!");
    },
  });

  const getModuleQ = useQuery({
    queryKey: ["module-by-id"],
    queryFn: () => getModuleById(moduleName?._id as string),
    enabled: moduleName != null,
  });
  const currentModule: object = getModuleQ.isSuccess
    ? getModuleQ.data.data
    : {};

  const createModuleForm = useFormik({
    initialValues: {
      name: "",
      blocks: [],
    },
    onSubmit: (data) => {
      createModuleMut.mutate(data);
    },
  });

  return (
    <div className="p-6 ">
      <h2 className="font-sans font-semibold text-xl mb-4">Module Creator</h2>

      <form
        onSubmit={createModuleForm.handleSubmit}
        className="flex p-3 space-x-4 items-center"
      >
        <p className="uppercase font-medium">create module</p>
        <FormItem>
          <Input
            value={createModuleForm.values.name}
            onChange={createModuleForm.handleChange}
            placeholder="Enter module name"
            name="name"
          />
        </FormItem>
        <Button type="submit" className="uppercase">
          create
        </Button>
      </form>
    </div>
  );
};

export default Home;
