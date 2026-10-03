from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(LabSettingConfiguration)
admin.site.register(CoagulationConfiguration)
admin.site.register(SlowMixingConfiguration)
admin.site.register(ConcentrationConfiguration)
admin.site.register(RawWaterAnalysisConfiguration)
admin.site.register(RawWaterSample)
admin.site.register(RawWaterQuality)
admin.site.register(Recommendation)
admin.site.register(ValidationSession)
admin.site.register(ValidationTrial)
admin.site.register(ResultingWaterQuality)