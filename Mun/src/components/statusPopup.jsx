import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";
import { X } from "lucide-react";

const StatusPopup = ({ open, onClose, message, isSuccess }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <div className={`p-4 rounded-lg ${
          isSuccess ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex justify-between items-start">
            <AlertDialogHeader>
              <AlertDialogTitle className={`text-lg font-semibold ${
                isSuccess ? 'text-green-800' : 'text-red-800'
              }`}>
                {isSuccess ? 'Success' : 'Error'}
              </AlertDialogTitle>
            </AlertDialogHeader>
            
            <button
              onClick={onClose}
              className={`inline-flex items-center justify-center rounded-md p-2 ${
                isSuccess 
                  ? 'text-green-500 hover:bg-green-100' 
                  : 'text-red-500 hover:bg-red-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <AlertDialogDescription className={`mt-2 ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </AlertDialogDescription>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusPopup;