import React from "react";
import clsx from "clsx";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";

export type DialogBaseProps = {
  className?: string;
  open: boolean;
  close: () => void;
};
const DialogBase: React.FC<DialogBaseProps> = ({ className, open, close }) => {
  return (
    <Dialog className={clsx("", className)} open={open} onClose={close}>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
        necessitatibus eos quaerat. Voluptatibus inventore culpa explicabo
        voluptates ducimus magni veritatis fuga repudiandae! Impedit, temporibus
        quaerat ipsam quasi ipsa at iste.
      </DialogDescription>
      <DialogBody></DialogBody>
      <DialogActions>
        <Button plain onClick={close}>
          Cancel
        </Button>
        <Button onClick={close}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBase;
