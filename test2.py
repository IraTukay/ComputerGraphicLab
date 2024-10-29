import wx
import cv2
import numpy as np
class ImageProcessingApp(wx.Frame):
    def __init__(self, *args, **kwargs):
        super(ImageProcessingApp, self).__init__(*args, **kwargs)

        self.ishodnoe_photo = None
        self.result_ph = None

        self.panel = wx.Panel(self)
        self.sizer = wx.BoxSizer(wx.VERTICAL)


        self.image_display = wx.StaticBitmap(self.panel)  #  на нем будут изображения
        self.sizer.Add(self.image_display, 1, wx.ALIGN_CENTER | wx.ALL, 5)
        labelforLoad = "Load Image"
        self.load_button = wx.Button(self.panel, label=labelforLoad)
        labelfor1BUTTON = "Apply Mean Filter - anti-aliasing"
        self.m_Filt_BUTTON_ = wx.Button(self.panel, label=labelfor1BUTTON)  # сглаживание - Средний фильтр
        labelfor2BUTTON = "Apply Mean Filter - anti-aliasing"
        self.gaussian_filter_button = wx.Button(self.panel, label=labelfor2BUTTON)  # гауссовское размытие
        labelfor3BUTTON = "Local Threshold (Niblack)"
        self.niblack_button = wx.Button(self.panel, label=labelfor3BUTTON)   # локальная адаптивная пороговая обработка - адаптивный порог с Гауссовым методом.
        labelfor4BUTTON = "Local Threshold (Bernsen)"
        self.bernsen_Button = wx.Button(self.panel, label=labelfor4BUTTON)    #  метод вычисляет порог на основе локальной статистики в окне вокруг каждого пикселя

        self.sizer.Add(self.load_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.m_Filt_BUTTON_, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.gaussian_filter_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.niblack_button, 0, wx.ALIGN_CENTER | wx.ALL, 5)
        self.sizer.Add(self.bernsen_Button, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        self.panel.SetSizer(self.sizer)

        self.load_button.Bind(wx.EVT_BUTTON, self.toLoadImage)
        self.m_Filt_BUTTON_.Bind(wx.EVT_BUTTON, self.Usrednenny_filter_sgl)
        self.gaussian_filter_button.Bind(wx.EVT_BUTTON, self.gaussovskoe_razmytie)
        self.niblack_button.Bind(wx.EVT_BUTTON, self.loc_porog_niblack)
        self.bernsen_Button.Bind(wx.EVT_BUTTON, self.loc_porog_bernsen)

        self.SetTitle("Image Processing App")
        self.SetSize((801, 603))
        self.Centre()


# ивенты для кнопочек
    def toLoadImage(self, event):
       
        with wx.FileDialog(self, "Open Image file", wildcard="Image files (*.bmp;*.png;*.jpg)|*.bmp;*.png;*.jpg",
                           style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as file_dialog:
            if file_dialog.ShowModal() == wx.ID_OK:
                path = file_dialog.GetPath()
                self.ishodnoe_photo = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
                self.display_image(self.ishodnoe_photo)

    def display_image(self, image, fixed_height=600):
      
        h, width = image.shape
        aspect_ratio = width / h
        new_height = fixed_height
        new_width = int(aspect_ratio * new_height)

        resized_image = cv2.resize(image, (new_width, new_height))

        image_rgb = cv2.cvtColor(resized_image, cv2.COLOR_GRAY2RGB)
        h, w = image_rgb.shape[:2]


        bmp = wx.Bitmap.FromBuffer(w, h, image_rgb)
        self.image_display.SetBitmap(bmp)
        self.panel.Layout()
        self.sizer.Layout()

    def Usrednenny_filter_sgl(self, event):
       
        if self.ishodnoe_photo is not None:   # проверка на то что изображение загружено
            kernel = np.ones((9, 9), np.float32) / 81    # вокруг пикселя рассматриваем область 5 на 5
            self.result_ph = cv2.filter2D(self.ishodnoe_photo, -1, kernel)
            self.display_image(self.result_ph)

    def gaussovskoe_razmytie(self, event):
     
        if self.ishodnoe_photo is not None:
            self.result_ph = cv2.GaussianBlur(self.ishodnoe_photo, (9, 9), 0)   # влияние пикселей друг на друга будет уменьшаться с расстоянием
            self.display_image(self.result_ph)

    def loc_porog_niblack(self, event):

 
        if self.ishodnoe_photo is not None:
            window_size = 8
            half_window = window_size // 2
            k = -0.2
                              # k определяет, какую часть границы объекта взять в качестве самого объекта. Значение k=-0.2 задает достаточно хорошее разделение объектов, если они представлены черным цветом, а значение k=+0.2, – если объекты представлены белым цветом.
            self.result_ph = np.zeros_like(self.ishodnoe_photo)

            for i in range(half_window, self.ishodnoe_photo.shape[0] - half_window):
                for j in range(half_window, self.ishodnoe_photo.shape[1] - half_window):
                    local_region = self.ishodnoe_photo[i-half_window:i+half_window+1, j-half_window:j+half_window+1]

                    # Находим среднее и стандартное отклонение в локальной области
                    local_mean = np.mean(local_region)
                    local_std = np.std(local_region)             # может указывать на наличие границ или объектов.


                    threshold = local_mean + k * local_std


                    if self.ishodnoe_photo[i, j] > threshold:
                        self.result_ph[i, j] = 255  # Белый
                    else:
                        self.result_ph[i, j] = 0    # Черный


            self.display_image(self.result_ph)         # Подход Ниблака эффективен для изображений с сильно варьирующим освещением и шумом. объекты на фоне, учитывая их локальные особенности.

    def loc_porog_bernsen(self, event):
    # Bernsen
      if self.ishodnoe_photo is not None:
        window_size = 8
        half_ = window_size // 2
        self.result_ph = np.zeros_like(self.ishodnoe_photo)

        float_image = self.ishodnoe_photo.astype(np.float32)

        for i in range(half_, self.ishodnoe_photo.shape[0] - half_):
            for j in range(half_, self.ishodnoe_photo.shape[1] - half_):
                oblast = float_image[i-half_:i+half_+1, j-half_:j+half_+1]

                minLoc = np.min(oblast)
                maxLoc = np.max(oblast)

                threshold = (minLoc + maxLoc) / 2

                if float_image[i, j] > threshold:
                    self.result_ph[i, j] = 255
                else:
                    self.result_ph[i, j] = 0


        self.display_image(self.result_ph)
   # Этот метод может быть более стабильным, но менее чувствительным к различиям в контрасте объектов.


if __name__ == '__main__':
    app = wx.App(False)
    frame = ImageProcessingApp(None)
    frame.Show()
    app.MainLoop()
