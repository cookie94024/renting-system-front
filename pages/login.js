import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Link from "next/link";
import axios from "axios";
import { API_BASE } from "../constants";
import { useRouter } from "next/router";
import classNames from "classnames";
import useUserStore from "../stores/useUserStore";
import { useLayoutEffect, useState } from "react";
import { api } from "../api";
import Modal from "../components/Modal";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const token = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  useLayoutEffect(() => {
    if (token) {
      router.push("/");
    }
  }, []);

  const mutation = useMutation(
    async (data) => {
      const tokenData = await axios.post(API_BASE + "/api/login/", data);
      const token = tokenData.data.token;
      window.localStorage.setItem("token", token);
      setToken(token);

      const userResponse = await api().get(API_BASE + "/api/user/");
      const userData = userResponse.data;

      return {
        userData,
      };
    },
    {
      onSuccess: ({ userData }) => {
        setUser(userData);
        router.push("/");
      },
      onError: () => {
        setShouldOpenModal(true);
      },
    }
  );
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/3/3a/NCULogo.svg"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              登入您的帳號
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm ">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  使用者名稱
                </label>
                <input
                  {...register("username")}
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white"
                  placeholder="使用者名稱"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密碼
                </label>
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white"
                  placeholder="密碼"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="/register">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    沒有帳號嗎？點此創建
                  </span>
                </Link>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isLoading}
                className={classNames(
                  "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  {
                    "bg-indigo-300 hover:bg-indigo-300 focus:bg-indigo-300":
                      mutation.isLoading,
                  }
                )}
              >
                {mutation.isLoading && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 animate-spin" viewBox="3 3 18 18">
                      <path
                        className="fill-indigo-400"
                        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                      />
                      <path
                        className="fill-indigo-200"
                        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                      />
                    </svg>
                  </span>
                )}
                登入
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        open={shouldOpenModal}
        onClose={() => setShouldOpenModal(false)}
        type="error"
        title="登入失敗"
        message="請輸入正確的會員帳號密碼"
        buttonText="重試"
        buttonLink="/login"
      />
    </>
  );
}
