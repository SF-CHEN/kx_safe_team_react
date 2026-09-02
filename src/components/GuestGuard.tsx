import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Lock, LogIn, UserPlus } from 'lucide-react';

interface GuestGuardProps {
  open: boolean;
  onClose: () => void;
  action?: string;
}

export function GuestGuard({ open, onClose, action = '进行评测' }: GuestGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGuest } = useUser();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  if (!isGuest) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Lock className="w-7 h-7 text-blue-500" />
          </div>
          <DialogTitle className="text-lg">登录后方可{action}</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            您当前处于游客模式，无法{action}。请登录或注册账号以使用完整功能。
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => { onClose(); navigate('/login', { state: { from: returnTo } }); }}
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            去登录
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { onClose(); navigate('/register', { state: { from: returnTo } }); }}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            去注册
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
