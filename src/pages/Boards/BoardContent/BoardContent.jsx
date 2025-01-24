import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatter";
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};
function BoardContent({ board }) {
  //https://docs.dndkit.com/api-documentation/sensors
  // yêu cầu chuột phải di chuyển 10 pixel trước khi kích hoạt
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumnsState, setOrderedColumnsState] = useState([]);

  // cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  // điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumnsState(
      mapOrder(board?.columns, board?.columnOrderIds, "_id")
    );
  }, [board]);

  // tim column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumnsState.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const moveCardBetweenColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumnsState((prevColumns) => {
      // tim vi tri index cua cai overCard trong column dich (noi ma activeCard sap duoc tha vao)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 0 : 1;
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      // clone mang orderedColumnsState cu ra 1 cai moi de xu ly data roi return - cap nhat lai OrderedColumnsState moi
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        // xoa card dang keo ra khoi column cu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        // cap nhat lai cardOrderIds cua column cu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      if (nextOverColumn) {
        // kiem tra xem card dang keo co ton tai o overColumn hay khong, neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // tiep theo la them cai card dang keo vao overColumn theo vi tri index moi ma no sap duoc tha vao
        nextOverColumn.cards.splice(newCardIndex, 0, activeDraggingCardData);

        // xoa placeholder card neu co
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_Placeholder
        );

        // cap nhat lai cardOrderIds cua column moi
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };

  // trigger khi bat dau keo 1 phan tu (drag)
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    // set data cua phan tu dang keo (column or card) vao state de xu ly sau nay
    setActiveDragItemData(event?.active?.data?.current);

    // neu la keo card thi set lai column dang keo card
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // trigger khi dang keo 1 phan tu qua 1 phan tu khac (drag over)
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    // activeDraggingCard: la cai card dang dc keo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overCard: la cai card ma card active dang keo dang keo den
    const { id: overCardId } = over;

    // tim 2 column cua 2 cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  // trigger khi ket thuc keo 1 phan tu (drop) => hanh dong tha
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // kiem tra neu khong ton tai over thi return (keo linh tinh ra ngoai thi return luon trang loi)
    if (!over || !active) {
      return;
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: la cai card dang dc keo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      // overCard: la cai card ma card active dang keo dang keo den
      const { id: overCardId } = over;

      // tim 2 column cua 2 cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      // Hanh dong keo tha card giua 2 column khac nhau
      // Phai dung toi activeDraggingCardData.columnId or oldColumnWhenDraggingCard._id (set vao state tu buoc
      // handleDragStart) chu k phai activeData trong scope handleDragEnd nay vi sau khi di qua onDragOver toi day la
      // state cua card da bi cap nhat 1 lan roi)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // keo tha card trong cung 1 column

        // lay vi tri cu (tu tk oldColumnWhenDraggingCard) va vi tri moi (tu tk overCardId) cua card
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId
        );
        // lay vi tri moi ( tu tk overColumn)
        const newCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        // dung arrayMove de sap xep lai vi tri cua mang cards
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumnsState((prevColumns) => {
          // clone mang orderedColumnsState cu ra 1 cai moi de xu ly data roi return - cap nhat lai OrderedColumnsState moi
          const nextColumns = cloneDeep(prevColumns);

          // tim toi cai column ma chung ta dang tha
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );

          // cap nhat lai 2 gia tri moi la card va cardOrderIds trong cai targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // neu vi tri keo den khac vi tri keo thi moi thuc hien sap xep lai
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumnsState.findIndex(
          (c) => c._id === active.id
        );
        const newColumnIndex = orderedColumnsState.findIndex(
          (c) => c._id === over.id
        );
        // dung arrayMove de sap xep lai vi tri cua mang columns
        //https://docs.dndkit.com/presets/sortable ( tham khao code array move)
        const dndOrderedColumns = arrayMove(
          orderedColumnsState,
          oldColumnIndex,
          newColumnIndex
        );

        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        console.log(dndOrderedColumnsIds);
        setOrderedColumnsState(dndOrderedColumns);
      }
    }

    // reset lai cac state khi keo tha xong 1 phan tu
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  // chúng ta sẽ custom lại thuật toán phát hiện va chạm tối ưu cho việc kéo thả
  // card giữa nhiều columns khác nhau
  // args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // trường hợp kéo thả column thì sử dụng thuật toán closetCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // tìm các điểm giao nhau, va chạm, tra ve 1 mang cac va cham - intersection với con trỏ
      const pointerIntersection = pointerWithin(args);

      // fix triệt để bug flickering thư viện dnd-kit trong trường hợp: kéo thả cái card có image cover lớn và kéo lên phía trên cùng
      // ra khỏi khu vực kéo thả
      if (!pointerIntersection?.length) {
        return;
      }

      // thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây ( không cần bước này nữa)
      // const intersections =
      //   pointerIntersection?.length > 0
      //     ? pointerIntersection
      //     : rectIntersection(args);

      // tìm overId đầu tiên trong đám pointerIntersection ở trên
      let overId = getFirstCollision(pointerIntersection, "id");

      if (overId) {
        // nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào
        // thuật toán phát hiện va chạm closetCorners hoặc closetCenter đều được. Tuy nhiên ở đây dùng closetCorners thấy
        // mượt mà hơn.
        const checkColumn = orderedColumnsState.find(
          (column) => column._id === overId
        );

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumnsState]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      // cam bien sensors de theo doi su kien keo tha
      sensors={sensors}
      // thuat toan phat hien va cham( neu ko co no thi card voi cover lon se ko keo qua column khac duoc vi
      // luc nay no dang bi conflict giua card va column) - tham khao them tai https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // nếu chỉ dùng closetCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}
      // tự custom nâng cao thuật toán phát hiện va chạm
      colllisionDetection={collisionDetectionStrategy}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          p: "10px 0",
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        }}
      >
        <ListColumns columns={orderedColumnsState} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
export default BoardContent;
