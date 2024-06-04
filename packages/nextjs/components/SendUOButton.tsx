import { useState } from "react";
import { useSendUserOperation, useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { arbitrumSepolia } from "@alchemy/aa-core";
import { Address } from "viem";

export const SendUOButton = () => {
  const [vitalik] = useState<Address>("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B");

  const { client, isLoadingClient } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
    gasManagerConfig: {
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
    },
    opts: {
      txMaxRetries: 20,
    },
  });

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendingUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  return (
    <div>
      {sendUserOperationResult == null ? (
        <button
          className="btn btn-primary"
          onClick={async () =>
            sendUserOperation({
              uo: {
                target: vitalik,
                data: "0x",
              },
            })
          }
        >
          <div>
            {(isSendingUserOperation || isLoadingClient) && <div>loading</div>}
            {isSendingUserOperation
              ? "Sending"
              : isSendingUserOperationError
              ? "Error, try again"
              : "Send a test transaction"}
          </div>
        </button>
      ) : (
        <a href={`${arbitrumSepolia.blockExplorers?.default.url}/tx/${sendUserOperationResult.hash}`} target="_blank">
          View transaction details
        </a>
      )}
    </div>
  );
};
