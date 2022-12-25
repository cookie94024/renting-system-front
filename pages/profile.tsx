import { Controller, useForm } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import DatePicker from "../components/DatePicker";
import { useMutation } from "react-query";
import axios from "axios";
import { API_BASE } from "../constants";
import { format } from "date-fns";
import classNames from "classnames";
import { useState } from "react";
import Modal from "../components/Modal";
import useUserStore, { User } from "../stores/useUserStore";

const RegisterPage = ({ userData }: { userData: User }) => {
  const [registerSuccess, setRegisterSuccess] = useState("close");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<Omit<User, "user"> & { email: string }>({
    defaultValues: {
      member_sex: userData?.member_sex,
      member_addr: userData?.member_addr,
      member_birth: userData?.member_birth,
      member_phone: userData?.member_phone,
    },
  });

  const mutation = useMutation(
    (data) => axios.patch(API_BASE + "/api/member/" + userData.id + "/", data),
    {
      onError: (error: any) => {
        const errorsData = error.response.data as Record<string, any>;
        const errors = {};
        for (let key in errorsData) {
          const data = errorsData[key];
          errors[key] = errorsData[key][0];
          // @ts-ignore
          setError(key, { message: errorsData[key][0] });
        }
      },
      onSuccess: () => {
        setRegisterSuccess("success");
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      birth: data.birth ? format(data.birth, "yyyy-MM-dd") : "",
    });
  };

  const handleModalClose = () => {
    setRegisterSuccess("close");
  };

  const inputClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
  const errorBorderClassName =
    "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500";

  return (
    <>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                會員資訊
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                您在這裡可以修改部分會員資訊
              </p>
            </div>
          </div>
          {userData && (
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        使用者名稱
                      </label>
                      <div className="text-gray-500 mt-1">
                        {userData.member_name}
                      </div>
                      <span className="text-xs text-red-500"></span>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="text-gray-500 mt-1">
                        {userData.user.email}
                      </div>
                    </div>

                    <Controller
                      control={control}
                      name="member_birth"
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                        fieldState: { invalid, isTouched, isDirty, error },
                        formState,
                      }) => (
                        <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                          <label
                            htmlFor="city"
                            className={classNames(
                              "block text-sm font-medium text-gray-700"
                            )}
                          >
                            出生年月日
                          </label>
                          <DatePicker
                            value={new Date(value)}
                            onChange={(value) => {
                              const date = new Date(value);
                              onChange(format(value, "yyyy-MM-dd"));
                            }}
                          />
                          <span className="text-xs text-red-500">
                            {errors.member_birth?.message}
                          </span>
                        </div>
                      )}
                    />

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        手機號碼
                      </label>
                      <input
                        {...register("member_phone")}
                        type="text"
                        className={classNames(inputClassName, {
                          [errorBorderClassName]: errors.member_phone,
                        })}
                      />
                      <span className="text-xs text-red-500">
                        {errors.member_phone?.message}
                      </span>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        性別
                      </label>
                      <select
                        {...register("member_sex")}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="1">男性</option>
                        <option value="0">女性</option>
                        <option value="2">不選擇</option>
                      </select>
                      <span className="text-xs text-red-500">
                        {errors.member_sex?.message}
                      </span>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        地址
                      </label>
                      <input
                        {...register("member_addr")}
                        type="text"
                        className={classNames(inputClassName, {
                          [errorBorderClassName]: errors.member_addr,
                        })}
                      />
                      <span className="text-xs text-red-500">
                        {errors.member_addr?.message}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    修改
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <Modal
        open={registerSuccess === "success"}
        onClose={handleModalClose}
        type="success"
        title="修改成功"
        message=""
        buttonText="確定"
        buttonLink="/profile"
      />
    </>
  );
};

export default function RegisterPageContainer() {
  const userData = useUserStore((state) => state.user);

  if (!userData) return null;

  return <RegisterPage userData={userData} />;
}
