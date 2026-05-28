import Swal from "sweetalert2";

// Configure default toast layout with SweetAlert2
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: "rounded-xl border border-slate-100 shadow-xl bg-white font-sans text-xs",
  },
});

export const showToast = (title: string, icon: "success" | "error" | "warning" | "info" = "success") => {
  Toast.fire({
    icon,
    title,
  });
};

export const showSuccessAlert = (title: string, text?: string) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#4f46e5", // Indigo color accent
    customClass: {
      popup: "rounded-xl border border-slate-100 font-sans shadow-lg",
      confirmButton: "px-5 py-2 rounded-lg font-bold text-xs cursor-pointer",
    },
  });
};

export const confirmAlert = async (title: string, text: string, confirmText: string = "Ya, Hapus") => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // Rose red
    cancelButtonColor: "#64748b", // Slate
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    customClass: {
      popup: "rounded-xl border border-slate-100 font-sans shadow-lg",
      confirmButton: "px-5 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm mx-1",
      cancelButton: "px-5 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm mx-1",
    },
  });
  return result.isConfirmed;
};
