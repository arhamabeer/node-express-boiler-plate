export const responseBot = (_data) => {
  const payload = {
    status: _data.status,
    data: { ..._data },
  };

  return payload;
};
