export const closeContract = async (contract, deleteContract) => {
    try {
        if (!contract) {
            return { status: 'none' };
        }
        await deleteContract(contract?.guid);
        return { status: 'revoke' };
    } catch (err) {
        console.log(err);
        return { status: 'error', message: err.message };
    }
};
