import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { SmileTwoTone } from '@ant-design/icons';
import { Spin, Space, Button, Typography } from 'antd';
import { getData } from 'src/store/reducers/selfGradeSlice';
import { CheckForm } from './CheckForm';

const { Paragraph } = Typography;

type Iprops = {
  taskId?: string | null;
  handleEndCheck: () => void;
};

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.reviewRequest);
  const { task, loading } = useSelector((state: RootState) => state.selfGradeSlice);
  useEffect(
    () => {
      dispatch(getData(tasks, props.taskId));
    },
    [dispatch, props.taskId, tasks]
  );

  return loading ? (
    <Space>
      <Spin />
      <p>Task Loading...</p>
    </Space>
  ) : (
      <React.Fragment>
        {task && task.items ? (
          task.items.map((item: any, index: number) => {
            return (
              <CheckForm
                key={task.items && task.items.length - index}
                item={item}
                index={index}
              />
            )
          })
        ) : (
            <Paragraph>Close Modal and open later</Paragraph>
          )}
        <Button onClick={props.handleEndCheck}>
          Save and Close Check
        <SmileTwoTone />
        </Button>
      </React.Fragment>
    );
};
