"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RejectModal } from "./RejectModal";
import { approveContentRequest, rejectContentRequest } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface ApprovalButtonsProps {
  postId: string;
  onAction: () => void;
}

export function ApprovalButtons({ postId, onAction }: ApprovalButtonsProps) {
  const [approving, setApproving] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveContentRequest(postId);
      toast("Post aprovado! Publicando no Instagram...");
      onAction();
    } catch {
      toast("Erro ao aprovar. Tente novamente.", "error");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (reason: string) => {
    setRejecting(true);
    try {
      await rejectContentRequest(postId, reason);
      toast("Post rejeitado.");
      setShowReject(false);
      onAction();
    } catch {
      toast("Erro ao rejeitar. Tente novamente.", "error");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-3">
        <Button
          variant="success"
          size="sm"
          className="flex-1"
          loading={approving}
          onClick={handleApprove}
        >
          <Check className="h-4 w-4" />
          Aprovar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => setShowReject(true)}
          disabled={approving}
        >
          <X className="h-4 w-4" />
          Rejeitar
        </Button>
      </div>

      {showReject && (
        <RejectModal
          onConfirm={handleReject}
          onCancel={() => setShowReject(false)}
          loading={rejecting}
        />
      )}
    </>
  );
}
