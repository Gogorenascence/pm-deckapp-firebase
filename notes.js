const queryList = {
    "name": "Joe",
    "address": "12102 Jump Tr.",
    "phoneNumber": 12345676890,
    "Job": "Forklift safety instructor",
    "number of sisters": 3
}

let reactionQuery = query(reactionsCollectionRef);

for (const [key, value] of Object.entries(queryList)) {
    reactionQuery = where(reactionQuery, key, "==", value);
}
