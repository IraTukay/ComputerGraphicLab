import wx
import cv2
import numpy as np
class ImageProcessingApp(wx.Frame):
    def __init__(self, *args, **kwargs):
        super(ImageProcessingApp, self).__init__(*args, **kwargs)

        self.original_image = None
        self.processed_image = None

        self.panel = wx.Panel(self)
        self.sizer = wx.BoxSizer(wx.VERTICAL)


        self.image_display = wx.StaticBitmap(self.panel)  #  на нем будут изображения
        self.sizer.Add(self.image_display, 1, wx.ALIGN_CENTER | wx.ALL, 5)

        self.load_button = wx.Button(self.panel, label="Load Image")
        self.mean_filter_button = wx.Button(self.panel, label="Apply Mean Filter - anti-aliasing")  # сглаживание - Средний фильтр 
        self.gaussian_filter_button = wx.Button(self.panel, label="Apply Gauss Filter -  anti-aliasing")  # гауссовское размытие
        self.adaptive_threshold_gaussian_button = wx.Button(self.panel, label="Local Threshold (Niblack)")   # локальная адаптивная пороговая обработка - адаптивный порог с Гауссовым методом.
        self.adaptive_threshold_mean_button = wx.Button(self.panel, label="Local Threshold (Bernsen)")    #  метод вычисляет порог на основе локальной статистики в окне вокруг каждого пикселя

        self.sizer.Add(self.load_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.mean_filter_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.gaussian_filter_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.adaptive_threshold_gaussian_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.adaptive_threshold_mean_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        self.panel.SetSizer(self.sizer)

        self.load_button.Bind(wx.EVT_BUTTON, self.on_load_image)
        self.mean_filter_button.Bind(wx.EVT_BUTTON, self.on_apply_mean_filter)
        self.gaussian_filter_button.Bind(wx.EVT_BUTTON, self.on_apply_gaussian_filter)
        self.adaptive_threshold_gaussian_button.Bind(wx.EVT_BUTTON, self.on_apply_adaptive_threshold_niblack)
        self.adaptive_threshold_mean_button.Bind(wx.EVT_BUTTON, self.on_apply_adaptive_threshold_bernsen)

        self.SetTitle("Image Processing App")
        self.SetSize((800, 600))
        self.Centre()


# ивенты для кнопочек
    def on_load_image(self, event):
        """ Load an image from a file. """
        with wx.FileDialog(self, "Open Image file", wildcard="Image files (*.jpg;*.png;*.bmp)|*.jpg;*.png;*.bmp",
                           style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as file_dialog:
            if file_dialog.ShowModal() == wx.ID_OK:
                image_path = file_dialog.GetPath()
                self.original_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                self.display_image(self.original_image)

    def display_image(self, image, fixed_height=600):
        """ Display the image with fixed height and centered. """
        height, width = image.shape
        aspect_ratio = width / height
        new_height = fixed_height
        new_width = int(aspect_ratio * new_height)

        resized_image = cv2.resize(image, (new_width, new_height))

        image_rgb = cv2.cvtColor(resized_image, cv2.COLOR_GRAY2RGB)
        h, w = image_rgb.shape[:2]


        bmp = wx.Bitmap.FromBuffer(w, h, image_rgb)
        self.image_display.SetBitmap(bmp)
        self.panel.Layout()
        self.sizer.Layout()

    def on_apply_mean_filter(self, event):
        """ Apply mean filter to the image. """
        if self.original_image is not None:   # проверка на то что изображение загружено
            kernel = np.ones((9, 9), np.float32) / 81    # вокруг пикселя рассматриваем область 5 на 5
            self.processed_image = cv2.filter2D(self.original_image, -1, kernel)
            self.display_image(self.processed_image)

    def on_apply_gaussian_filter(self, event):
        """ Apply Gaussian filter to the image. """
        if self.original_image is not None:
            self.processed_image = cv2.GaussianBlur(self.original_image, (9, 9), 0)   # влияние пикселей друг на друга будет уменьшаться с расстоянием
            self.display_image(self.processed_image)

    def on_apply_adaptive_threshold_niblack(self, event):

        """ Apply Niblack's method for local thresholding. """
        if self.original_image is not None:
            window_size = 8
            half_window = window_size // 2
            k = -0.2
                              # k определяет, какую часть границы объекта взять в качестве самого объекта. Значение k=-0.2 задает достаточно хорошее разделение объектов, если они представлены черным цветом, а значение k=+0.2, – если объекты представлены белым цветом.
            self.processed_image = np.zeros_like(self.original_image)

            for i in range(half_window, self.original_image.shape[0] - half_window):
                for j in range(half_window, self.original_image.shape[1] - half_window):
                    local_region = self.original_image[i-half_window:i+half_window+1, j-half_window:j+half_window+1]

                    # Находим среднее и стандартное отклонение в локальной области
                    local_mean = np.mean(local_region)
                    local_std = np.std(local_region)             # может указывать на наличие границ или объектов.


                    threshold = local_mean + k * local_std


                    if self.original_image[i, j] > threshold:
                        self.processed_image[i, j] = 255  # Белый
                    else:
                        self.processed_image[i, j] = 0    # Черный


            self.display_image(self.processed_image)         # Подход Ниблака эффективен для изображений с сильно варьирующим освещением и шумом. объекты на фоне, учитывая их локальные особенности.

    def on_apply_adaptive_threshold_bernsen(self, event):
    # Bernsen
      if self.original_image is not None:
        window_size = 8
        half_window = window_size // 2
        self.processed_image = np.zeros_like(self.original_image)

        float_image = self.original_image.astype(np.float32)

        for i in range(half_window, self.original_image.shape[0] - half_window):
            for j in range(half_window, self.original_image.shape[1] - half_window):
                local_region = float_image[i-half_window:i+half_window+1, j-half_window:j+half_window+1]

                local_min = np.min(local_region)
                local_max = np.max(local_region)

                threshold = (local_min + local_max) / 2

                if float_image[i, j] > threshold:
                    self.processed_image[i, j] = 255
                else:
                    self.processed_image[i, j] = 0


        self.display_image(self.processed_image)
   # Этот метод может быть более стабильным, но менее чувствительным к различиям в контрасте объектов.


if __name__ == '__main__':
    app = wx.App(False)
    frame = ImageProcessingApp(None)
    frame.Show()
    app.MainLoop()
