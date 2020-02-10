import { RequiredWidgetContent } from './required-widget-content';

export interface PictureWidgetContent extends RequiredWidgetContent {
  unitOfMeasure: string;
  currentValue: string;
}
