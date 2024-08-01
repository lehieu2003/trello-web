/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

// xử lý bug logic thư viện dnd-kit khi column là rỗng:
// phía FE sẽ tự tạo ra 1 cái card đặc biệt: Placeholder card, không liên quan tới backend,
// Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng
// cấu trúc Id của card đặc biệt để Unique rất đơn giản, không cần phải làm phức tạp:
// "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa 1 cái Placholder Card)
// Quang trọng khi tạo: phải đầy đủ ( _id, boardId, columnId, FE_Placeholder )
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    title: "",
    FE_Placeholder: true,
  };
};
