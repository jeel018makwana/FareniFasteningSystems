import { useQuery } from "@tanstack/react-query";

import { getPayments } from "../api/paymentsApi";

export const usePayments = ({
  page = 1,
  search = "",
  payment_type = "",
} = {}) => {
  return useQuery({
    queryKey: [
      "payments",
      page,
      search,
      payment_type,
    ],

    queryFn: () =>
      getPayments({
        page,
        search,
        payment_type,
      }),
  });
};